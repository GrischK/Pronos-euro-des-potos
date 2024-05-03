import { Tabs } from "./Tabs";

export function TabsDemo({ tabsContent }: any) {
  const tabs = tabsContent.map((tab: any, index: number) => ({
    title: `${index + 1}. ${tab.name}`,
    value: tab.name,
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-r from-gray-900 to-sky-950">
        <p>{tab.name}</p>
        <p>{tab.points} points</p>
        <img
          src={tab.picture}
          alt="dummy image"
          className="object-cover h-[20vh] absolute inset-x-0 w-[20vh] rounded-full mx-auto"
        />
      </div>
    ),
  }));

  return (
    <div className="h-[40vh] w-[30vw] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto items-start justify-start">
      <Tabs tabs={tabs} />
    </div>
  );
}
