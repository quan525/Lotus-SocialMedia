

// Check difference between two date
export const handleDateDiff = (date) => {
    const currentDate = new Date();
    const providedDate = new Date(date);
    const diffTime = Math.abs(currentDate - providedDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffMinutes < 1) {
        return "Just now";
    } else if (diffHours < 1) {
        return diffMinutes + (diffMinutes === 1 ? " minute ago" : " minutes ago");
    } else if (diffHours < 24) {
        return diffHours + (diffHours === 1 ? " hour ago" : " hours ago");
    } else {
        const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
        if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return diffDays + " days ago";
        } else {
            return providedDate.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    }
}