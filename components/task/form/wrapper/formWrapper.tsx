type FormWrapperProps = {
  title: string;
  children: React.ReactNode;
};

export function FormWrapper({ title, children }: FormWrapperProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </>
  )
}