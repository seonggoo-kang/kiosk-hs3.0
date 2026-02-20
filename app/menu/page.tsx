import dynamic from "next/dynamic"

const MenuContent = dynamic(() => import("./menu-content"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted-foreground">{"로딩 중..."}</p>
    </div>
  ),
})

export default function MenuPage() {
  return <MenuContent />
}
