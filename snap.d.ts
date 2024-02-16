interface SnapOptions {
  update?: boolean;
  cwd: String
}


type snap = (obj: any) => Promise<any>;

export default function build(url: String, opts: SnapOptions): snap;
