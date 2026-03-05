import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Shield, Loader2, CheckCircle2, XCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";

export function MFASettings() {
  const [factors, setFactors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [unenrolling, setUnenrolling] = useState(false);

  useEffect(() => {
    fetchFactors();
  }, []);

  const fetchFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      setFactors(data?.totp || []);
    } catch (error: any) {
      console.error("Error fetching MFA factors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Authenticator App",
      });
      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
    } catch (error: any) {
      console.error("Error enrolling MFA:", error);
      toast.error(error.message || "Failed to start MFA enrollment");
    } finally {
      setEnrolling(false);
    }
  };

  const handleVerify = async () => {
    if (!factorId || !verifyCode) return;

    setVerifying(true);
    try {
      const { data: challengeData, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode,
      });
      if (verifyError) throw verifyError;

      toast.success("Two-factor authentication enabled successfully");
      setQrCode(null);
      setSecret(null);
      setFactorId(null);
      setVerifyCode("");
      await fetchFactors();
    } catch (error: any) {
      console.error("Error verifying MFA:", error);
      toast.error(error.message || "Invalid verification code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleUnenroll = async (id: string) => {
    setUnenrolling(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
      if (error) throw error;

      toast.success("Two-factor authentication disabled");
      await fetchFactors();
    } catch (error: any) {
      console.error("Error unenrolling MFA:", error);
      toast.error(error.message || "Failed to disable 2FA");
    } finally {
      setUnenrolling(false);
    }
  };

  const cancelEnrollment = () => {
    setQrCode(null);
    setSecret(null);
    setFactorId(null);
    setVerifyCode("");
  };

  const verifiedFactors = factors.filter((f) => f.status === "verified");
  const isEnabled = verifiedFactors.length > 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Two-Factor Authentication (2FA)
            </CardTitle>
            <CardDescription>
              Add an extra layer of security using any TOTP authenticator app:
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Google Authenticator", "Authy", "Microsoft Authenticator", "1Password", "Duo Mobile"].map((app) => (
                <span key={app} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{app}</span>
              ))}
            </div>
          </div>
          {isEnabled ? (
            <Badge variant="default" className="bg-success text-success-foreground gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Enabled
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" />
              Disabled
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enrollment flow */}
        {qrCode && (
          <div className="space-y-4 p-4 rounded-lg border border-border bg-card">
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-foreground">
                Scan this QR code with your authenticator app
              </p>
              <div className="inline-block p-3 bg-white rounded-lg">
                <img src={qrCode} alt="MFA QR Code" className="h-48 w-48" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Or enter this secret key manually:
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono select-all">
                  {secret}
                </code>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verifyCode">Enter the 6-digit code from your app</Label>
              <div className="flex gap-2">
                <Input
                  id="verifyCode"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="font-mono text-center text-lg tracking-widest"
                />
                <Button
                  variant="hero"
                  onClick={handleVerify}
                  disabled={verifying || verifyCode.length !== 6}
                >
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                </Button>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={cancelEnrollment} className="w-full">
              Cancel
            </Button>
          </div>
        )}

        {/* Current status */}
        {!qrCode && !isEnabled && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Two-factor authentication adds an extra layer of protection to your account. 
              When enabled, you'll need to enter a code from your authenticator app each time you sign in. 
              This is recommended for compliance with IRS Publication 4557 and FTC Safeguards Rule.
            </p>
            <Button variant="hero" onClick={handleEnroll} disabled={enrolling} className="gap-2">
              {enrolling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Enable 2FA
                </>
              )}
            </Button>
          </div>
        )}

        {!qrCode && isEnabled && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Your account is protected with two-factor authentication via authenticator app.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive gap-2">
                  <XCircle className="h-4 w-4" />
                  Disable 2FA
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disable Two-Factor Authentication?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reduce the security of your account. You will only need your password to sign in. 
                    This is not recommended for accounts handling sensitive financial data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Enabled</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleUnenroll(verifiedFactors[0].id)}
                    disabled={unenrolling}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {unenrolling ? "Disabling..." : "Disable 2FA"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
