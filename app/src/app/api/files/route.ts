import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const preferredRegion = ["iad1"];

const keyRestrictions = {
  keyName: "Signed Upload JWT",
  maxUses: 1,
  permissions: {
    endpoints: {
      data: {
        pinList: false,
        userPinnedDataTotal: false,
      },
      pinning: {
        pinFileToIPFS: true,
        pinJSONToIPFS: false,
        pinJobs: false,
        unpin: false,
        userPinPolicy: false,
      },
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify(keyRestrictions),
    };

    const jwtRepsonse = await fetch(
      "https://api.pinata.cloud/users/generateApiKey",
      options
    );
    const json = await jwtRepsonse.json();
    const { JWT } = json;
    return NextResponse.json({ JWT }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}