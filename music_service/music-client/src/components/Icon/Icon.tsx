import React from 'react';
import { IconType, IconBaseProps } from 'react-icons';

interface IconProps {
    icon: IconType;
    size?: number;
    className?: string;
}

export const Icon: React.FC<IconProps> = ({ icon, size, className }) => {
    const IconComponent = icon as React.FC<IconBaseProps>;
    return (
        <span className={className} style={{ fontSize: size, display: 'inline-flex', alignItems: 'center' }}>
            <IconComponent size={size} />
        </span>
    );
}; 