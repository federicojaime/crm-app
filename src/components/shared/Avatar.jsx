// src/components/shared/Avatar.jsx
const Avatar = ({ name, size = 'md', className = '' }) => {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    const sizes = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-16 h-16 text-xl',
    };

    return (
        <div
            className={`
          flex items-center justify-center rounded-full font-medium
          ${sizes[size]}
          ${className}
        `}
        >
            {initials}
        </div>
    );
};

export default ContactDetail;