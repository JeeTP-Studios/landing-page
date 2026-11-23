import { useSite } from "@/content/ContentContext";
import ClientsMarquee from "./ClientsMarquee";

/** The client logo band, fed by the single clients list. */
export default function Clients() {
  const { clients } = useSite();
  return <ClientsMarquee logos={clients.logos} label={clients.title} />;
}
