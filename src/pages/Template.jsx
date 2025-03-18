import Nav from "../layouts/Nav";
import { useTheme } from "../hooks/useTheme";

const Template = () => {
  const { dark, setDark } = useTheme();

  return (
    <div>
      <Nav
        dark={dark}
        setDark={setDark}
      />
      <h1>Template</h1>
    </div>
  );
};

export default Template;
