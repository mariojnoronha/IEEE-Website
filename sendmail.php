<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ── include PHPMailer ──────────────────────────────────────────────
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// ── grab & sanitise form fields ───────────────────────────────────
$fname   = filter_input(INPUT_POST, 'First Name', FILTER_SANITIZE_SPECIAL_CHARS);
$lname   = filter_input(INPUT_POST, 'Last Name',  FILTER_SANITIZE_SPECIAL_CHARS);
$email   = filter_input(INPUT_POST, 'email',      FILTER_VALIDATE_EMAIL);
$message = filter_input(INPUT_POST, 'message',    FILTER_SANITIZE_STRING);

if (!$fname || !$lname || !$email || !$message) {
    header('Location: index.html?error=send'); exit;
}

// ── SMTP credentials (Brevo example – change to suit) ─────────────
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = 'smtp-relay.brevo.com';    // ← change if not Brevo
    $mail->SMTPAuth   = true;
    $mail->Username   = 'ieeecomputersocietyxim25@gmail.com';  // ← change
    $mail->Password   = 'dB0wtkzAXNI3ghRY';           // ← change
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // ── 1) send notification to site owner ──────────────────────────
    $owner = 'ieeecomputersocietyxim25@gmail.com';                  // ← your inbox
    $mail->setFrom($email, "$fname $lname");
    $mail->addAddress($owner, 'Site Owner');
    $mail->Subject = "New message from $fname $lname";
    $mail->Body =
        "Name: $fname $lname\n".
        "Email: $email\n\n".
        "Message:\n$message\n";
    $mail->send();

    // ── 2) send confirmation back to visitor ────────────────────────
    $mail->clearAddresses();
    $mail->setFrom($owner, 'IEEE‑CS XIM Website');
    $mail->addAddress($email, "$fname $lname");
    $mail->Subject = 'We received your message!';
    $mail->Body =
        "Hi $fname,\n\n".
        "Thank you for contacting IEEE‑CS XIM. We have received the following message:\n\n".
        "\"$message\"\n\n".
        "We’ll reply soon.\n\n– IEEE Computer Society, XIM University";
    $mail->send();

    header('Location: index.html?success=true');
    } catch (Exception $e) {
    error_log('Mailer Error: '.$mail->ErrorInfo);
    header('Location: index.html?error=send');
}
