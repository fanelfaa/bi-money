import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import * as xml2js from "xml2js";

export const loader: LoaderFunction = async () => {
  const date = new Date();
  const nowDate = date.toISOString().slice(0, 10);
  const parser = new xml2js.Parser();
  const kursXMLString = await fetch(
    `https://www.bi.go.id/biwebservice/wskursbi.asmx/getSubKursLokal3?mts=USD&startdate=${nowDate}&enddate=${nowDate}`
  ).then((response) => response.text());

  const kursXMLJSON = await parser
    .parseStringPromise(kursXMLString)
    .then((data) => data.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table[0]);

  const kursRupiah = {
    id: kursXMLJSON.id_subkurslokal[0],
    lnk: kursXMLJSON.lnk_subkurslokal[0],
    nil: kursXMLJSON.nil_subkurslokal[0],
    beli: kursXMLJSON.beli_subkurslokal[0],
    jual: kursXMLJSON.jual_subkurslokal[0],
    tgl: kursXMLJSON.tgl_subkurslokal[0],
    mts: kursXMLJSON.mts_subkurslokal[0],
  };

  return json({ kursRupiah, nowDate });
};

export default function Index() {
  const { kursRupiah, nowDate } = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>
        IDR to USD hari ini : <span>{nowDate}</span>
      </h1>
      <h3>
        Beli : Rp. <span>{kursRupiah.beli}</span>
      </h3>
      <h3>
        Jual : Rp. <span>{kursRupiah.jual}</span>
      </h3>
      <div>
        source{" "}
        <a
          href="https://www.bi.go.id/id/statistik/informasi-kurs/transaksi-bi/default.aspx"
          target="_blank"
          rel="noreferrer"
        >
          Bank Indonesia
        </a>
      </div>
    </div>
  );
}
