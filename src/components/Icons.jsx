export function Icon({ name, className = "h-4 w-4" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (name === "dashboard") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
      </svg>
    );
  }
  if (name === "request") return <PathIcon {...common} d="M12 5v14M5 12h14" />;
  if (name === "active") return <PathIcon {...common} d="M12 3v5m0 8v5m9-9h-5M8 12H3m15.4 6.4-3.5-3.5M9.1 9.1 5.6 5.6m12.8 0-3.5 3.5M9.1 14.9l-3.5 3.5" />;
  if (name === "history") return <PathIcon {...common} d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5m4-3v6l4 2" />;
  if (name === "audit") return <PathIcon {...common} d="M12 3 4 7v6c0 5 3.2 7.7 8 8 4.8-.3 8-3 8-8V7l-8-4Z" />;
  if (name === "clock") return <PathIcon {...common} d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />;
  if (name === "user") return <PathIcon {...common} d="M20 21a8 8 0 0 0-16 0m11-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />;
  if (name === "resource") return <PathIcon {...common} d="M4 4h16v16H4zM4 10h16M10 4v16" />;
  if (name === "token") return <PathIcon {...common} d="m8 8 8 8M16 8l-8 8M12 3l9 9-9 9-9-9 9-9Z" />;
  if (name === "settings") return <PathIcon {...common} d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8 3.5-.9.5a1 1 0 0 0-.46 1.23l.31.95-1.8 3.1-1-.18a1 1 0 0 0-1.06.48l-.5.88H9.4l-.5-.88a1 1 0 0 0-1.06-.48l-1 .18-1.8-3.1.31-.95a1 1 0 0 0-.46-1.23L4 12l.89-.5a1 1 0 0 0 .46-1.22l-.31-.96 1.8-3.1 1 .18a1 1 0 0 0 1.06-.48l.5-.88h3.2l.5.88a1 1 0 0 0 1.06.48l1-.18 1.8 3.1-.31.96a1 1 0 0 0 .46 1.22L20 12Z" />;
  if (name === "login") return <PathIcon {...common} d="M10 17 15 12 10 7m5 5H4m8-9h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />;
  if (name === "logout") return <PathIcon {...common} d="M14 17 9 12l5-5m-5 5h11M10 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />;
  return <PathIcon {...common} d="M12 5v14M5 12h14" />;
}

function PathIcon(props) {
  const { d, ...rest } = props;
  return (
    <svg {...rest}>
      <path d={d} />
    </svg>
  );
}
