import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/FormatCurrency";

const Products = ({
  show,
  setShow,
  data,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  data: any;
}) => {
  return (
    <>
      {show && (
        <div
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/90 z-10"
          onClick={() => setShow(false)}
        >
          <Card
            className="max-w-6xl w-full max-h-[calc(100vh-4rem)] h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
            </CardHeader>

            <CardContent className="text-xs">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Valor Total (Impostos)</TableHead>
                    <TableHead>ICMS</TableHead>
                    <TableHead>IPI</TableHead>
                    <TableHead>PIS</TableHead>
                    <TableHead>COFINS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data &&
                    data.length > 0 &&
                    data.map((item: any) => (
                      <TableRow key={item.code}>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{formatCurrency(item.value)}</TableCell>
                        <TableCell>
                          {formatCurrency(item.taxes.total)}
                        </TableCell>
                        <TableCell>{formatCurrency(item.taxes.ICMS)}</TableCell>
                        <TableCell>{formatCurrency(item.taxes.IPI)}</TableCell>
                        <TableCell>{formatCurrency(item.taxes.PIS)}</TableCell>
                        <TableCell>
                          {formatCurrency(item.taxes.COFINS)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Products;
