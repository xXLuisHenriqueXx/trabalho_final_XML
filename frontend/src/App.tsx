import { useEffect, useState, type DragEvent } from "react";
import { Archive, BadgeCheck, BadgeX, Loader2 } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Modal } from "./components/Modal";

import { formatCurrency } from "./utils/FormatCurrency";

const App = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [success, setsuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [json, setJson] = useState<string | null>(null);

  const [generalInfos, setGeneralInfos] = useState<any>(null);
  const [taxesInfos, setTaxesInfos] = useState<any>(null);
  const [notesInfos, setNotesInfos] = useState<any>(null);
  const [supplierInfos, setSupplierInfos] = useState<any>(null);
  const [carrierInfos, setCarrierInfos] = useState<any>(null);

  const [showModalTaxes, setShowModalTaxes] = useState<boolean>(false);
  const [showModalCarrierSupplier, setShowModalCarrierSupplier] =
    useState<boolean>(false);
  const [selectedCarrierSupplier, setSelectedCarrierSupplier] =
    useState<any>(null);
  const [showModalNotes, setShowModalNotes] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setError(null);
    setsuccess(null);

    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`${data.error}: ${data.details}`);
      } else {
        setsuccess(data.message);
        setJson(JSON.stringify(data.json, null, 2));

        fetchAllInfos();
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor.");
    }
  };

  const fetchGeneralInfos = async () => {
    try {
      const response = await fetch("http://localhost:3000/stats/general");
      const data = await response.json();

      setGeneralInfos(data.notesTotal === 0 ? null : data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTaxesInfos = async () => {
    try {
      const response = await fetch("http://localhost:3000/stats/taxes");
      const data = await response.json();

      setTaxesInfos(data.message ? null : data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNotesInfos = async () => {
    try {
      const response = await fetch("http://localhost:3000/stats/notes/all");
      const data = await response.json();

      setNotesInfos(data.notes.length === 0 ? null : data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSupplierInfos = async () => {
    try {
      const response = await fetch("http://localhost:3000/stats/suppliers");
      const data = await response.json();

      setSupplierInfos(data.message ? null : data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCarrierInfos = async () => {
    try {
      const response = await fetch("http://localhost:3000/stats/carriers");
      const data = await response.json();

      setCarrierInfos(data.message ? null : data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllInfos = async () => {
    setLoading(true);

    await Promise.all([
      fetchGeneralInfos(),
      fetchTaxesInfos(),
      fetchNotesInfos(),
      fetchSupplierInfos(),
      fetchCarrierInfos(),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllInfos();
  }, []);

  if (loading)
    return (
      <main className="flex flex-col items-center justify-center w-full h-screen">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </main>
    );

  return (
    <main
      className="relative grid grid-cols-3 grid-rows-3 gap-2 w-full h-screen p-4"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Modal.Drag show={isDragging} />
      <Modal.TaxesNotes
        show={showModalTaxes}
        setShow={setShowModalTaxes}
        data={taxesInfos?.notes}
      />
      <Modal.CarrierSupplierNotes
        show={showModalCarrierSupplier}
        setShow={setShowModalCarrierSupplier}
        data={selectedCarrierSupplier?.notes}
      />
      <Modal.Products
        show={showModalNotes}
        setShow={setShowModalNotes}
        data={selectedNote}
      />

      <Card className="row-span-3 overflow-auto">
        <CardHeader>
          <CardTitle>
            {fileName || "Solte seu arquivo sobre esta tela"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-4">
          {success && (
            <Card className="bg-foreground/5">
              <CardContent className="flex items-center gap-x-4">
                <BadgeCheck className="h-4 w-4 text-green-500" />
                {success}
              </CardContent>
            </Card>
          )}
          {error && (
            <Card className="bg-foreground/5">
              <CardContent className="flex items-center gap-x-4">
                <BadgeX className="h-4 w-4 text-red-500" />
                {error}
              </CardContent>
            </Card>
          )}

          {success && json && <pre className="text-xs">{json}</pre>}
        </CardContent>
      </Card>

      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle className="text-xs uppercase">
            Informações Gerais das NFes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs">
          {generalInfos ? (
            <Table>
              <TableBody>
                <TableRow key={"general_infos_1"}>
                  <TableCell className="font-semibold">Total (Notas)</TableCell>
                  <TableCell>{generalInfos.notesTotal}</TableCell>
                </TableRow>

                <TableRow key={"general_infos_2"}>
                  <TableCell className="font-semibold">
                    Total (Produtos)
                  </TableCell>
                  <TableCell>{generalInfos.productsTotal}</TableCell>
                </TableRow>

                <TableRow key={"general_infos_3"}>
                  <TableCell className="font-semibold">
                    Valor Total (Notas)
                  </TableCell>
                  <TableCell>
                    {formatCurrency(generalInfos.notesTotalValue)}
                  </TableCell>
                </TableRow>

                <TableRow key={"general_infos_4"}>
                  <TableCell className="font-semibold">
                    Valor Total (Produtos)
                  </TableCell>
                  <TableCell>
                    {formatCurrency(generalInfos.productsTotalValue)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <pre>Nenhuma informação encontrada</pre>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle className="text-xs uppercase">
            Informações Gerais dos Impostos
          </CardTitle>

          {taxesInfos && (
            <CardAction>
              <button
                className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md text-xs outline-none cursor-pointer"
                onClick={() => setShowModalTaxes(true)}
              >
                Ver notas
              </button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="text-xs">
          {taxesInfos ? (
            <Table>
              <TableBody>
                <TableRow key={"taxes_infos_1"}>
                  <TableCell className="font-semibold">
                    Valor Total (ICMS)
                  </TableCell>
                  <TableCell>{formatCurrency(taxesInfos.total.ICMS)}</TableCell>
                </TableRow>

                <TableRow key={"taxes_infos_2"}>
                  <TableCell className="font-semibold">
                    Valor Total (IPI)
                  </TableCell>
                  <TableCell>{formatCurrency(taxesInfos.total.IPI)}</TableCell>
                </TableRow>

                <TableRow key={"taxes_infos_3"}>
                  <TableCell className="font-semibold">
                    Valor Total (PIS)
                  </TableCell>
                  <TableCell>{formatCurrency(taxesInfos.total.PIS)}</TableCell>
                </TableRow>

                <TableRow key={"taxes_infos_4"}>
                  <TableCell className="font-semibold">
                    Valor Total (COFINS)
                  </TableCell>
                  <TableCell>
                    {formatCurrency(taxesInfos.total.COFINS)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <pre>Nenhum imposto encontrado</pre>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-2 overflow-auto">
        <CardHeader>
          <CardTitle className="text-xs uppercase">Notas Fiscais</CardTitle>
        </CardHeader>
        <CardContent className="text-xs">
          {notesInfos ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produtos</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Emitente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notesInfos.notes &&
                  notesInfos.notes.length > 0 &&
                  notesInfos.notes.map((note: any) => (
                    <TableRow key={note.cnpj}>
                      <TableCell>
                        <button
                          className="p-2 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md outline-none cursor-pointer"
                          onClick={() => {
                            setShowModalNotes(true);
                            setSelectedNote(note.products);
                          }}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </TableCell>
                      <TableCell>{note.id}</TableCell>
                      <TableCell>{note.number}</TableCell>
                      <TableCell>{note.emit}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <pre>Nenhuma nota encontrada</pre>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle className="text-xs uppercase">
            Informações Gerais dos Fornecedores
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs">
          {supplierInfos ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Notas</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Nome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierInfos &&
                  supplierInfos.length > 0 &&
                  supplierInfos.map((supplier: any) => (
                    <TableRow key={supplier.cnpj}>
                      <TableCell>
                        <button
                          className="p-2 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md outline-none cursor-pointer"
                          onClick={() => {
                            setShowModalCarrierSupplier(true);
                            setSelectedCarrierSupplier(supplier);
                          }}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </TableCell>
                      <TableCell>{supplier.cnpj}</TableCell>
                      <TableCell>{supplier.name}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <pre>Nenhum fornecedor encontrado</pre>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle className="text-xs uppercase">
            Informações Gerais das Transportadoras
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs">
          {carrierInfos ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Notas</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Nome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carrierInfos &&
                  carrierInfos.length > 0 &&
                  carrierInfos.map((carrier: any) => (
                    <TableRow key={carrier.cnpj}>
                      <TableCell>
                        <button
                          className="p-2 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md outline-none cursor-pointer"
                          onClick={() => {
                            setShowModalCarrierSupplier(true);
                            setSelectedCarrierSupplier(carrier);
                          }}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </TableCell>
                      <TableCell>{carrier.cnpj}</TableCell>
                      <TableCell>{carrier.name}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <pre>Nenhuma transportadora encontrada</pre>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default App;
