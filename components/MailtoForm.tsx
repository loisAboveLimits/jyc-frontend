"use client";

/**
 * A form that opens the visitor's email app with the message filled in.
 * It is a stand-in until the forms are connected to the backend (Drupal).
 * Fields are read by their `name`: "email", and the optional "firstName",
 * "lastName" and "message".
 */
export default function MailtoForm({
  to,
  subject,
  className,
  children,
}: {
  to: string;
  subject: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = String(data.get("email") ?? "");
        const message = String(data.get("message") ?? "");
        const name = [data.get("firstName"), data.get("lastName")]
          .map((part) => String(part ?? "").trim())
          .filter(Boolean)
          .join(" ");
        const body = [message, [name, email].filter(Boolean).join("\n")].filter(Boolean).join("\n\n");
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }}
    >
      {children}
    </form>
  );
}
