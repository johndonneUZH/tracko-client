import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuroraText } from "../magicui/aurora-text";

export function Numbers() {
  
    return (
    <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 rounded-lg border-none shadow-none mt-20 text-left flex">
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-black dark:text-white">Key Numbers About Tracko</CardTitle>
            <CardDescription className="text-md text-gray-600 dark:text-gray-400">
                Discover how Tracko is making team collaboration more efficient and productive. The numbers are as reported by our users.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-2">
            <div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Increased Productivity</h3>
                <p className="text-lg text-gray-500 dark:text-gray-400">Boost your team&apos;s productivity by streamlining idea organization.</p>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                <AuroraText>86%</AuroraText>
            </div>
        </div>
        <div className="flex items-center justify-between gap-2">
            <div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Reduced Meeting Time</h3>
                <p className="text-lg text-gray-500 dark:text-gray-400">Save time by organizing ideas before meetings, focusing on discussions instead of brainstorming.</p>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                <AuroraText>91%</AuroraText>
            </div>
        </div>
        <div className="flex items-center justify-between gap-2">
            <div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">More Creative Work</h3>
                <p className="text-lg text-gray-500 dark:text-gray-400">Free up time for creative tasks by improving the efficiency of the ideation process.</p>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                <AuroraText>79%</AuroraText>
            </div>
        </div>
        </CardContent>
    </Card>
    );
}