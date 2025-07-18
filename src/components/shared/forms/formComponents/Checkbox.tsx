interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <div>
      <label className="group inline-flex items-center cursor-pointer space-x-2 py-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="hidden peer"
        ></input>
        <div
          className="w-5 h-5 mr-2 rounded border border-dark peer-checked:border-yellow peer-checked:bg-yellow flex items-center justify-center 
        xl:group-hover:border-yellow group-focus-visible:border-yellow transition duration-300 ease-in-out"
        >
          <svg
            className="w-3 h-auto text-dark opacity-0 group-has-[:checked]:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span className="text-[12px] desk:text-[18px] font-medium  xl:group-hover:text-yellow group-focus-visible:text-yellow transition duration-300 ease-in-out">
          {label}
        </span>
      </label>
    </div>
  );
};

export default Checkbox;
