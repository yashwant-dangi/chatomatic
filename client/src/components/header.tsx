import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

function Header() {
  const navigate = useNavigate();
  const handleSignupClick = () => {
    navigate("/signup");
  };
  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <>
      <header className="flex px-2 items-center h-20">
        <h2>Chatomatic</h2>
        <div className="ml-auto flex gap-4">
          <Button variant={"outline"} onClick={handleSignupClick}>
            sign up
          </Button>
          <Button variant={"outline"} onClick={handleLoginClick}>
            login
          </Button>
        </div>
      </header>
      <Separator />
    </>
  );
}

export default Header;
