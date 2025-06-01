export const getInitials = (name) => {
    if (!name) return '';

    const names = name.split(' ');
    let initials = '';

    for (let i = 0; i < Math.min(names.length, 2); i++) {
        initials += names[i][0].toUpperCase();
    }

    return initials;
}