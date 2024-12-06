import { Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useDarkMode } from '@/hooks/useDarkMode'

export function ModeToggle() {
    const { isDarkMode, toggleDarkMode } = useDarkMode()
    return (
        <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {
                isDarkMode ? <Moon className='h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100' /> : <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:-rotate-90 dark:scale-0' />
            }
        </Button>
    )
}

