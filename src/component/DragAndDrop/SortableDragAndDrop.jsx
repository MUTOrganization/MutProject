import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableItem } from "./SortableItem";
export default function SortableDragAndDrop({ items, keyFieldName = 'id', children, onChange }) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = items.findIndex(e => e[keyFieldName] == active.id);
            const newIndex = items.findIndex(e => e[keyFieldName] == over.id);
            onChange(arrayMove(items, oldIndex, newIndex));
        }
    }
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                {items.map((e, index) => {
                    return (
                        <SortableItem key={e[keyFieldName]} id={e[keyFieldName]} item={e}>
                            {children(e, index)}
                        </SortableItem>
                    )
                })}
            </SortableContext>
        </DndContext>
    )
}

// Usage:
// const [data, setData] = [
//     { id: 1, name: 'Item 1' },
//     { id: 2, name: 'Item 2' },
//     { id: 3, name: 'Item 3' },
//     { id: 4, name: 'Item 4' },
//     { id: 5, name: 'Item 5' },
// ]

// <SortableDragAndDrop
//     items={data}
//     keyFieldName={'id'}
//     onChange={(newOrderData) => setData(newOrderData)}
// >
//     {(item, index) => (
//         <div key={item.id} className="mb-2">
//             {item.name}
//         </div>
//     )}
// </SortableDragAndDrop>