import * as React from "react";
import { cn } from "../../utils/cn";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputMode?:
    | "email"
    | "search"
    | "tel"
    | "text"
    | "url"
    | "none"
    | "numeric"
    | "decimal"
    | undefined;
}

const GradientInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputMode, ...props }, ref) => {
    const radius = 100; // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = React.useState(false);

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`radial-gradient(${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,var(--blue-500),transparent 80%)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="p-[2px] rounded-lg transition duration-300 group/input"
      >
        <input
          type={type}
          inputMode={inputMode}
          className={cn(
            `flex h-10 border-none bg-gray-50 text-black rounded-md px-3 py-2 text-xl file:border-0 font-medium file:bg-transparent 
                                file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400
                                 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:text-[#7a8aa0] disabled:opacity-100
                                 group-hover/input:shadow-none transition duration-400 w-full text-center placeholder:font-bold placeholder:text-2xl`,
            className,
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  },
);
GradientInput.displayName = "Input";

export { GradientInput };
