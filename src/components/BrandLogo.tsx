import Image from "next/image";
import logo from "../../public/brand/logo.png";
import icon from "../../public/brand/icon.png";
import { architect } from "@/data/portfolio";
import styles from "./BrandLogo.module.css";

export default function BrandLogo({ priority = false, variant = "full" }: { priority?: boolean; variant?: "full" | "mark" }) {
  const mark = variant === "mark";
  return (
    <span className={`${styles.frame} ${mark ? styles.mark : ""}`}>
      <Image
        src={mark ? icon : logo}
        alt={`${architect.name} — ${architect.role}`}
        className={styles.image}
        sizes={mark ? "44px" : "190px"}
        priority={priority}
        placeholder="empty"
      />
    </span>
  );
}
