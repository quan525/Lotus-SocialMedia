

// Check difference between two date
export const handleDateDiff = (date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const providedDate = new Date(date);
    providedDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(currentDate - providedDate);
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

    if (diffDays < 1) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours < 1) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        if (diffMinutes < 1) {
            return "Just now";
        } else {
            return diffMinutes + (diffMinutes === 1 ? " minute ago" : " minutes ago");
        }
    } else {
        return diffHours + (diffHours === 1 ? " hour ago" : " hours ago");
    }
    } else {
    // Adjusted logic here
    if (diffDays < 2) {
        return "Yesterday";
    } else {
        // This will now correctly show "2 days ago" after 24 hours have passed
        return diffDays + " days ago";
    }
    }
}