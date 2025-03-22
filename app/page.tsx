"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import styles from "@/styles/page.module.css";
import { Globe } from "../components/magicui/globe"

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <Globe/>
        </div>
        <Button
          type="primary"
          variant="solid"
          onClick={() => router.push("/login")}
        >
          Go to login
        </Button>
      </main>
    </div>
  );
}
