<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'mailgeldisana@gmail.com';
        $mail->Password   = base64_decode('enRxeGF2aGluaXl1dHZ1YQ==');
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        $mail->setFrom('mailgeldisana@gmail.com', 'Boyntoy Contact');
        $mail->addAddress('mustafa.baykal@gmail.com');

        $name = htmlspecialchars($_POST["name"]);
        $email = htmlspecialchars($_POST["email"]);
        $message_plain = htmlspecialchars($_POST["message"]);
        $message_html = nl2br($message_plain);

        $mail->addReplyTo($email);
        $mail->isHTML(true);
        $mail->Subject = 'Contact Form Message';
        $mail->Body    = "<strong>Name:</strong> {$name}<br><strong>Email:</strong> {$email}<br><strong>Message:</strong><br>{$message_html}";
        $mail->AltBody = "Name: {$name}\nEmail: {$email}\nMessage:\n{$message_plain}";

        $mail->send();
        header("Location: thank-you.html");
        exit;
    } catch (Exception $e) {
        echo "<h2>❌ Message could not be sent. Mailer Error: {$mail->ErrorInfo}</h2>";
    }
} else {
    echo "<h2>Access denied.</h2>";
}
?>
