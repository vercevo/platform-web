
export const dynamic = 'force-dynamic';
import ValheimServerStatus from "../components/valheim-server-status";

export default async function Page() {
  const backendUrl = process.env.NEXT_PUBLIC_VALHEIM_BACKEND_URL!;
  return (
    <div>
      <ValheimServerStatus backendUrl={backendUrl} />
    </div>
  );
}
