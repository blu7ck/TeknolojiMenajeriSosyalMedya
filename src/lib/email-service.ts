import { createClient } from "./supabase/client"

export async function sendWelcomeEmail(email: string, firstName: string, lastName: string, gender?: "male" | "female") {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.functions.invoke("send-welcome-email", {
      body: { email, firstName, lastName, gender },
    })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Failed to send welcome email:", error)
    return { success: false, error }
  }
}

export async function sendNewPostNotification(postId: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.functions.invoke("send-new-post-notification", {
      body: { postId },
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send new post notification:", error)
    return { success: false, error }
  }
}
