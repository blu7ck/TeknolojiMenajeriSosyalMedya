// Feedback scheduler - 1 hafta sonra feedback email gönderimi
import { createClient } from "./supabase/client"

export async function scheduleFeedbackEmail(requestId: string, email: string, name: string) {
  const supabase = createClient()
  
  try {
    // 1 hafta sonra feedback email gönder
    await supabase.functions.invoke('send-email', {
      body: {
        type: 'feedback_request',
        to: email,
        data: {
          name,
          email,
          website: '', // Will be filled from database
          requestId
        }
      }
    })
    
    console.log('Feedback email scheduled for 1 week later')
  } catch (error) {
    console.error('Feedback scheduling error:', error)
  }
}

// Admin panel'den manuel feedback email gönderimi
export async function sendFeedbackEmail(requestId: string, email: string, name: string, website: string) {
  const supabase = createClient()
  
  try {
    await supabase.functions.invoke('send-email', {
      body: {
        type: 'feedback_request',
        to: email,
        data: {
          name,
          email,
          website,
          requestId
        }
      }
    })
    
    console.log('Feedback email sent manually')
  } catch (error) {
    console.error('Manual feedback email error:', error)
  }
}
