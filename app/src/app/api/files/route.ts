import { NextResponse, NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  //   try {
  //     const data = await request.formData();
  //     const file: File | null = data.get("file") as unknown as File;
  //     data.append("file", file);
  //     data.append("pinataMetadata", JSON.stringify({ name: "File to upload" }));
  //     const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${process.env.PINATA_JWT}`,
  //       },
  //       body: data,
  //     });
  //     const { IpfsHash } = await res.json();
  //     console.log(IpfsHash);

  //     return NextResponse.json({ IpfsHash }, { status: 200 });
  //   } catch (e) {
  //     console.log(e);
  // return NextResponse.json(
  //   { error: "Internal Server Error" },
  //   { status: 500 }
  // );
  //   }

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
    // res.send(JWT);
    return NextResponse.json({ JWT }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
