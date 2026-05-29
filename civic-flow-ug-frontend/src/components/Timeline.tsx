"use client";

export default function Timeline() {
	const items = [
		{ id: 1, text: "Complaint created", time: "2026-05-25 10:12" },
		{ id: 2, text: "Assigned to Officer Jane Doe", time: "2026-05-26 09:04" },
	];

	return (
		<div className="space-y-3">
			{items.map((it) => (
				<div key={it.id} className="flex items-start gap-3">
					<div className="h-2 w-2 rounded-full bg-blue-600 mt-2" />
					<div>
						<div className="text-sm">{it.text}</div>
						<div className="text-xs text-gray-500">{it.time}</div>
					</div>
				</div>
			))}
		</div>
	);
}
