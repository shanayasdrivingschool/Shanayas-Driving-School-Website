type BrandWaveDividerProps = {
  className?: string;
  flipY?: boolean;
  showBottomLine?: boolean;
  bottomLineColor?: string;
};

const BrandWaveDivider = ({
  className = "",
  flipY = false,
  showBottomLine = false,
  bottomLineColor = "#FFFFFF",
}: BrandWaveDividerProps) => (
  <div aria-hidden className={`pointer-events-none overflow-hidden ${className}`}>
    <svg
      viewBox="0 0 1280 300"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      style={flipY ? { transform: "scaleY(-1)", transformOrigin: "center" } : undefined}
    >
      <path
        fill="#1d52a1"
        d="M0,142.8c0,0,106.5,75.3,300.8,75.3s379.9-161,547-203.2C1040.8-33.9,1147.7,45,1280,142.8v139.8H0V142.8z"
      />
      <path
        fill="#E6242A"
        d="M1280,171.3c0,0-47.1,1.2-106.7-34.3c-27.4-16.3-66.8-49.2-130.7-49.2c-101.1,0-222.2,87.1-319.6,116.6c-183.4,55.5-300.8,35.3-375.6-12.3c-141.4-90-233.3-50.9-264.4-37.2c-41,18.1-83,16.4-83,16.4v122.3l1280-1V171.3z"
      />
      <path
        fill="#FFFFFF"
        d="M1280,213.5V300H0v-86.5c0,0,190.7,57.2,341.2,45.4c178.3-14,225.4-66.5,359.4-121.4c59.8-24.5,97.3-34.4,146.9-37.3c49.1-2.8,77.4,5.4,130.8,20.4c119.1,33.4,206.1,70.3,285.5,89.4C1269.2,211.4,1274.6,212.5,1280,213.5z"
      />
    </svg>
    {showBottomLine ? (
      <div className="absolute inset-x-0 bottom-0 h-[2px]" style={{ backgroundColor: bottomLineColor }} />
    ) : null}
  </div>
);

export default BrandWaveDivider;
