import { listUserFilesInBucket } from "@/actions/files.actions";
import { auth } from "@/auth";
import { StackedHorizontalBarChart } from "@/components/custom/stacked-horizontal-bar-chart";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { formatFileSize, groupFileTypesToChart } from "@/lib/utils";
import { CircleGauge } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ManageFolders() {
  const session = await auth();
  if (!session) redirect(DEFAULT_LOGIN_ROUTE);

  const files = await listUserFilesInBucket(session.user.email);
  const { chartData, chartConfig } = groupFileTypesToChart(files.data);

  return (
    <main className="relative h-full w-full py-4 px-6">
      <section className="space-y-3">
        <section className="flex justify-between gap-2 items-center px-2">
          <h1 className="text-2xl font-extralight text-muted-foreground">
            Storage Sense
          </h1>
          <section className="text-muted-foreground flex flex-col items-center">
            <span className="flex gap-1 items-center">
              <CircleGauge className="size-3 stroke-2" />
              <p className="text-xs font-medium">Usage</p>
            </span>
            <p>{formatFileSize(files.size)}</p>
          </section>
        </section>
        <StackedHorizontalBarChart
          chartConfig={chartConfig}
          chartData={chartData}
        />
      </section>
      
    </main>
  );
}
