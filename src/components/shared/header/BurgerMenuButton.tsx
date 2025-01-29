interface BurgerMenuButtonProps {
  isHeaderMenuOpened?: boolean;
  toggleHeaderMenuOpen?: () => void;
}

const firstLineBaseStyles = "top-0 left-0 opacity-100";
const firstLineTransformStyles = "rotate-45 top-[11px]";
const secondLineBaseStyles = "top-[8px] left-0";
const secondLineTransformStyles = "rotate-[-45deg] top-[11px]";
const thirdLineBaseStyles = "top-[16px] right-0";
const thirdLineTransformStyles = "bottom-[-2px] right-[3px] opacity-0";

export default function BurgerMenuButton({
  isHeaderMenuOpened,
  toggleHeaderMenuOpen,
}: BurgerMenuButtonProps) {
  return (
    <button
      aria-label="open menu button"
      type="button"
      onClick={toggleHeaderMenuOpen}
      className="group relative z-[60] size-[46px] px-[7.5px] py-[13px] outline-none before:content-['']
           before:absolute before:-z-10 before:top-0 before:left-0 before:rounded-full before:size-0 before:opacity-0 before:transition 
           before:duration-1000 before:ease-out active:before:opacity-100 focus-visible:before:opacity-100 laptop:hover:before:opacity-100 
           before:bg-yellowGradient before:blur-[4px]"
    >
      <div className="w-full h-full rotate-0 ">
        <span
          className={`block absolute w-full h-[2.8px] rounded-md bg-yellowGradient rotate-0 
                  transition duration-[600ms] ease-out ${
                    isHeaderMenuOpened
                      ? firstLineTransformStyles
                      : firstLineBaseStyles
                  }`}
        ></span>
        <span
          className={`block absolute left-0 w-full h-[2.6px] rounded-md bg-yellowGradient rotate-0 
                  transition duration-[600ms] ease-out ${
                    isHeaderMenuOpened
                      ? secondLineTransformStyles
                      : secondLineBaseStyles
                  }`}
        ></span>
        <span
          className={`block absolute right-0 w-[19px] h-[2.8px] rounded-md bg-yellowGradient rotate-0  
                  transition duration-[600ms] ease-out ${
                    isHeaderMenuOpened
                      ? thirdLineTransformStyles
                      : thirdLineBaseStyles
                  }`}
        ></span>
      </div>
    </button>
  );
}
