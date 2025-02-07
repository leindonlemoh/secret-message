import { redirect } from 'next/navigation'
import { logout } from '../../lib/auth-actions'
import { createClient } from '../../utils/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  console.log(data)
  if (error || !data?.user) {
    redirect('/error')
  }
  return(
  <div>
<form>
  <button formAction={logout}>Log Out</button>
</form>
    <p>Hello {data.user.user_metadata.full_name}</p>
  </div>  
  
  )
}