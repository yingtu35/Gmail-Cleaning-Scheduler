export default function Footer() {
  const curTime = new Date();
  return (
    <footer className="flex items-center justify-center w-full h-24 border-t">
      <a
        className="flex items-center justify-center"
        href="https://github.com/yingtu35"
        target="_blank"
        rel="noopener noreferrer"
      >Ying Tu</a>
      <span className="mx-2">©</span>
      <span>{curTime.getFullYear()}</span>
    </footer>
  );
}