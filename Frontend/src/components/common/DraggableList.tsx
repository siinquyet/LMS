import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
	arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { type ReactNode } from "react";

interface SortableItemProps {
	id: string | number;
	children: ReactNode;
	className?: string;
}

export const SortableItem: React.FC<SortableItemProps> = ({
	id,
	children,
	className = "",
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 50 : "auto",
	};

	return (
		<div
			ref={setNodeRef}
			style={style as any}
			className={`${className} ${isDragging ? "shadow-lg" : ""}`}
		>
			<div className="flex items-start gap-2">
				<div
					{...attributes}
					{...listeners}
					className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0"
				>
					<GripVertical className="w-5 h-5" />
				</div>
				<div className="flex-1">{children}</div>
			</div>
		</div>
	);
};

interface DraggableListProps<T extends { id: string | number }> {
	items: T[];
	onReorder: (newOrder: T[]) => void;
	children: (item: T, index: number) => ReactNode;
	className?: string;
	renderItem?: (item: T, index: number) => ReactNode;
	keyExtractor?: (item: T) => string | number;
}

export function DraggableList<T extends { id: string | number }>({
	items,
	onReorder,
	children,
	className = "",
}: DraggableListProps<T>) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = items.findIndex((item) => item.id === active.id);
		const newIndex = items.findIndex((item) => item.id === over.id);

		if (oldIndex !== -1 && newIndex !== -1) {
			const newOrder = arrayMove(items, oldIndex, newIndex);
			onReorder(newOrder);
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={items.map((item) => item.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className={`space-y-2 ${className}`}>
					{items.map((item, index) => (
						<SortableItem key={item.id} id={item.id}>
							{children(item, index)}
						</SortableItem>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}

interface FlatSortableItemProps {
	id: string | number;
	children: ReactNode;
	className?: string;
}

export const FlatSortableItem: React.FC<FlatSortableItemProps> = ({
	id,
	children,
	className = "",
}) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
		zIndex: isDragging ? 1000 : "auto",
	};

	return (
		<div
			ref={setNodeRef}
			style={style as React.CSSProperties}
			className={`${className} ${isDragging ? "scale-[1.02] shadow-xl" : ""}`}
		>
			<div className="flex items-center gap-2">
				<div
					{...attributes}
					{...listeners}
					className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
				>
					<GripVertical className="w-4 h-4" />
				</div>
				<div className="flex-1">{children}</div>
			</div>
		</div>
	);
};

export default DraggableList;