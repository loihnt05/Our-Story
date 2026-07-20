import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { UserSyncService } from "@/lib/services/user-sync";

export async function POST(req: Request) {
  // Retrieve CLERK_WEBHOOK_SECRET from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[Clerk Webhook] Error: CLERK_WEBHOOK_SECRET is not configured.");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Reject requests missing signature headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("[Clerk Webhook] Error: Missing required Svix headers.");
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the raw request body string (CRITICAL: req.text() preserves exact signature spacing)
  const body = await req.text();

  // Create a new Svix Webhook verification instance
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload signature
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[Clerk Webhook] Error: Signature verification failed.", err);
    return new Response("Error occurred during signature verification", { status: 400 });
  }

  const eventType = evt.type;
  const { id } = evt.data;

  if (!id) {
    console.error("[Clerk Webhook] Error: Missing user ID in event data.");
    return new Response("Missing user ID in event data", { status: 400 });
  }

  console.log(`[Clerk Webhook] Successfully verified signature. Event: ${eventType} | User ID: ${id}`);

  try {
    switch (eventType) {
      case "user.created": {
        const data = evt.data;
        const email_addresses = data.email_addresses || [];
        const primaryEmail = email_addresses.find(
          (email: any) => email.id === data.primary_email_address_id
        )?.email_address || email_addresses[0]?.email_address;

        if (!primaryEmail) {
          console.error(`[Clerk Webhook] Sync rejected: User ${id} has no email address.`);
          return new Response("User must have an email address", { status: 400 });
        }

        await UserSyncService.createUser({
          clerkId: id,
          email: primaryEmail,
          firstName: data.first_name || null,
          lastName: data.last_name || null,
          imageUrl: data.image_url || null,
        });
        break;
      }

      case "user.updated": {
        const data = evt.data;
        const email_addresses = data.email_addresses || [];
        const primaryEmail = email_addresses.find(
          (email: any) => email.id === data.primary_email_address_id
        )?.email_address || email_addresses[0]?.email_address;

        await UserSyncService.updateUser(id, {
          email: primaryEmail,
          firstName: data.first_name || null,
          lastName: data.last_name || null,
          imageUrl: data.image_url || null,
        });
        break;
      }

      case "user.deleted": {
        await UserSyncService.deleteUser(id);
        break;
      }

      default:
        console.log(`[Clerk Webhook] Event ignored: Unhandled event type "${eventType}"`);
        break;
    }

    return new Response("Successfully processed webhook", { status: 200 });
  } catch (error) {
    console.error(`[Clerk Webhook] Execution Error on ${eventType}:`, error);
    return new Response("Error occurred during database sync operations", { status: 500 });
  }
}
