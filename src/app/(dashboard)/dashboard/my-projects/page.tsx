import { redirect } from 'next/navigation'

export default function LegacyMyProjectsRedirect() {
  redirect('/dashboard')
}
