const draggables = document.querySelectorAll('.itemDraggable');
const containers = document.querySelectorAll('.capsule');
const successPrompt = document.querySelector('.success');
const resetButton = document.querySelector('.reset');
let droppedItems = [];

draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
    });
});

containers.forEach((container) => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterAnyElement(container, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
    });

    container.addEventListener('drop', () => {
        droppedItems = Array.from(containers[1].querySelectorAll('.itemDraggable')).map((item) => item.textContent);

        successPrompt.textContent = 'Item Dropped: ' + droppedItems.join(', ');

        successPrompt.style.display = 'block';
    });
});

function getDragAfterAnyElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.itemDraggable:not(.dragging)')];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

function resetElements() {
    const firstCapsule = containers[0];
    const secondCapsule = containers[1];

    secondCapsule.querySelectorAll('.itemDraggable').forEach((item) => {
        firstCapsule.appendChild(item);
        item.classList.remove('dragging');
    });

    droppedItems = [];

    successPrompt.style.display = 'none';
}
