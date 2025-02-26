export function formatDate(dateString, locale = 'th-TH'){
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    } catch (error) {
      console.error("Invalid date string:", dateString, error);
      return dateString; // Return the original string if formatting fails
    }
  }