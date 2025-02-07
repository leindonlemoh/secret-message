'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Swal from 'sweetalert2'
import { createClient } from '../utils/supabase/server'

export async function login(formData) {
  const supabase = await createClient()


  const data = {
    
    email: formData.get('email') ,
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }


  revalidatePath('/home', 'layout')
  redirect('/home?tab=profile')
}

export async function signup(formData) {
  const supabase = await createClient()

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  const data = {
    email: formData.get('email') ,
    password: formData.get('password') ,
    options:{
        data:{
            full_name: `${firstName + " " + lastName }`,
            email: formData.get("email")
        }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()



  const { user,error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
