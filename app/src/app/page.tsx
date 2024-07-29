"use client";

// import Button from "@/components/layout/Button";
// import Card from "@/components/layout/Card";
// import Body3 from "@/components/typography/Body3";
// import Headline3 from "@/components/typography/Headline3";
import Logo from "@/components/typography/Logo";
import UnderlinedAnchor from "@/components/typography/UnderlinedAnchor";
import { Body3, Button, Card, Headline3 } from "@gordo-d/mufi-ui-components";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	return (
		<div className="absolute left-0 top-0 grid h-screen w-screen grid-rows-dashboard overflow-hidden bg-brand-gradient">
			<header className="py-2 text-center">
				<Logo className="justify-center" />
			</header>
			<main className="flex items-center justify-center">
				<div className="max-w-xl p-4">
					<Card className="p-10">
						<div className="text-center">
							<Headline3>Sign into your account</Headline3>
						</div>
						<div className="py-4">
							<Button
								// Placeholder
								onClick={() => {
									router.push("/dashboard");
								}}
								// End placeholder
								className="w-full"
							>
								Connect your wallet
							</Button>
						</div>
						<Body3 className="">
							By clicking sign up you agree to the{" "}
							<UnderlinedAnchor href="#">terms of service</UnderlinedAnchor> and 
							<UnderlinedAnchor href="#">privacy policy</UnderlinedAnchor>
						</Body3>
					</Card>
				</div>
			</main>
		</div>
	);
}