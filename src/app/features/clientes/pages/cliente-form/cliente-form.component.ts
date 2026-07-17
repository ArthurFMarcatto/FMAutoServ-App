import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    telefone: [''],
    celular: ['', [Validators.required]],
    cpfcnpj: ['', [Validators.required]],
    endereco: ['', [Validators.maxLength(255)]],
    bairro: ['', [Validators.maxLength(255)]],
    cidade: ['', [Validators.maxLength(255)]]
  });

  editando = false;
  id?: number;
  error = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = Number(idParam);
      this.editando = true;

      this.clienteService.findById(this.id).subscribe({
        next: (cliente) => {
          this.form.patchValue({
            nome: cliente.nome ?? '',
            telefone: cliente.telefone ?? '',
            celular: cliente.celular ?? '',
            cpfcnpj: cliente.cpfcnpj ?? '',
            endereco: cliente.endereco ?? '',
            bairro: cliente.bairro ?? '',
            cidade: cliente.cidade ?? ''
          });
        },
        error: (err) => {
          console.error(err);
          this.error = 'Erro ao carregar cliente.';
        }
      });
    }
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const cliente = this.form.getRawValue();

    const req = this.editando && this.id
      ? this.clienteService.update(this.id, cliente)
      : this.clienteService.create(cliente);

    req.subscribe({
      next: () => this.router.navigate(['/clientes']),
      error: (err) => {
        console.error(err);
        this.error = 'Erro ao salvar cliente.';
      }
    });
  }
}