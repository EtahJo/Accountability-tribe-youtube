import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';

interface NavbarIconProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}
const NavbarIcon = ({ children, trigger }: NavbarIconProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="absolute right-0">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarIcon;