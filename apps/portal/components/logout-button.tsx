'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@workspace/ui/components/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <Button 
      onClick={handleLogout}
      variant="outline"
      size="sm"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  )
}