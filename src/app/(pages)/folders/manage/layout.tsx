import { listUserFilesAndFoldersInBucket } from "@/actions/files.actions";
import { auth } from "@/auth";
import { StackedHorizontalBarChart } from "@/components/custom/stacked-horizontal-bar-chart";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { formatFileSize, groupFileTypesToChart } from "@/lib/utils";
import { CircleGauge } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ManageFolders({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect(DEFAULT_LOGIN_ROUTE);

  const { files, folders, size } = await listUserFilesAndFoldersInBucket(
    session.user.email
  );
  const { chartData, chartConfig } = groupFileTypesToChart(
    files.map((f) => f.name)
  );

  return (
    <main className="relative h-full w-full py-4 px-6 space-y-4">
      <section className="flex justify-between gap-2 items-center px-2">
        <h1 className="text-2xl font-extralight text-muted-foreground">
          Storage Sense
        </h1>
        <section className="text-muted-foreground flex flex-col items-center">
          <span className="flex gap-1 items-center">
            <CircleGauge className="size-3 stroke-2" />
            <p className="text-xs font-medium">Usage</p>
          </span>
          <p>{formatFileSize(size)}</p>
        </section>
      </section>
      <StackedHorizontalBarChart
        chartConfig={chartConfig}
        chartData={chartData}
      />
      {children}
    </main>
  );
}
