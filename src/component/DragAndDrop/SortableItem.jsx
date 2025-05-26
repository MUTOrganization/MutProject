import {CSS} from '@dnd-kit/utilities'
import {useSortable} from '@dnd-kit/sortable'
export function SortableItem({id, children}){
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 999 : undefined,
        position: isDragging ? 'relative' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    )
}