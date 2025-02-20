'use server'

import { Resend } from 'resend'
import { ResetPasswordEmailTemplate } from '@/components/email/reset-password';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (email: string, resetToken: string) => {
    try {
        const resetPasswordLink = `${process.env.APP_URL}}/reset-password/${resetToken}`;
        await resend.emails.send({
            from: process.env.EMAIL_FROM || '',
            to: email,
            subject: 'CONSCOV AI - Password Reset Request',
            react: ResetPasswordEmailTemplate({ resetPasswordLink }),
        });

        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Failed to send password reset email', error);
        throw error;
    }
};
