import AboutMe from "@/components/with-3d/about-me";

export default async function P({
  searchParams,
}: {
  searchParams: Promise<{ y?: string }>;
}) {
  const { y } = await searchParams;
  return (
    <div style={{ marginTop: -Number(y ?? 0) }}>
      <AboutMe />
    </div>
  );
}
