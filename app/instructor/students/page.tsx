import {
	calculateProgressRates,
	getProfileStats,
	getStudents,
} from "@/app/_lib/supabase/queries";
import { StudentsList } from "./_components/students-list";

export const metadata = {
	title: "受講生管理 | GAS学習支援",
	description: "受講生の進捗状況を管理",
};

export default async function StudentsPage() {
	// データを並列取得
	const [students, stats] = await Promise.all([
		getStudents(),
		getProfileStats(),
	]);

	// 進捗率を一括計算
	const studentIds = students.map((s) => s.id);
	const progressRates = await calculateProgressRates(studentIds);

	// 進捗率を付与
	const studentsWithProgress = students.map((student) => ({
		...student,
		progressRate: progressRates.get(student.id) ?? 0,
	}));

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">受講生管理</h1>
				<p className="text-muted-foreground">全受講生の進捗状況を確認</p>
			</div>

			<StudentsList students={studentsWithProgress} stats={stats} />
		</div>
	);
}
